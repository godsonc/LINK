"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SERVICES } from "./catalog";
import { classifyStory } from "./classify";
import { buildNextSteps, buildPathway, rankServices } from "./match";
import { refineNeeds } from "./questions";
import {
  emptyBoard,
  emptySession,
  loadBoard,
  loadSession,
  logEvent,
  newId,
  saveBoard,
  saveSession,
} from "./store";
import type {
  BoardState,
  LocalityId,
  NeedId,
  SessionState,
} from "./types";

type LinkContextValue = {
  ready: boolean;
  session: SessionState;
  board: BoardState;
  setStory: (story: string, locality: LocalityId) => void;
  answerQuestion: (id: string, value: string) => void;
  toggleNeed: (id: NeedId) => void;
  confirmNeeds: () => void;
  acknowledgeSafeguarding: () => void;
  requestReferral: (input: {
    serviceId: string;
    contactName: string;
    contactPhone: string;
  }) => void;
  requestNavigator: (input: { reason: string; preferredContact: string }) => void;
  saveFollowUp: (accessed: "yes" | "no" | "not_yet", notes: string) => void;
  updateService: (
    serviceId: string,
    patch: BoardState["serviceOverrides"][string],
  ) => void;
  updateReferralStatus: (
    id: string,
    status: BoardState["referrals"][number]["status"],
  ) => void;
  updateCaseStatus: (
    id: string,
    status: BoardState["cases"][number]["status"],
  ) => void;
  resetResident: () => void;
};

const LinkContext = createContext<LinkContextValue | null>(null);

export function LinkProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<SessionState>(emptySession());
  const [board, setBoard] = useState<BoardState>(emptyBoard());

  useEffect(() => {
    setSession(loadSession());
    setBoard(loadBoard());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveSession(session);
  }, [ready, session]);

  useEffect(() => {
    if (ready) saveBoard(board);
  }, [ready, board]);

  const value = useMemo<LinkContextValue>(() => {
    const persistSession = (next: SessionState) => setSession(next);
    const persistBoard = (next: BoardState) => setBoard(next);

    return {
      ready,
      session,
      board,
      setStory(story, locality) {
        const classified = classifyStory(story);
        persistSession({
          ...emptySession(),
          story,
          locality,
          classified: classified.needs,
          selectedNeeds: classified.needs.map((need) => need.id),
          safeguarding: classified.safeguarding,
          safeguardingAcknowledged: false,
        });
        persistBoard(
          logEvent(board, "needs_discovery", "Resident described their situation."),
        );
      },
      answerQuestion(id, value) {
        persistSession({
          ...session,
          answers: { ...session.answers, [id]: value },
        });
      },
      toggleNeed(id) {
        const selected = session.selectedNeeds.includes(id)
          ? session.selectedNeeds.filter((need) => need !== id)
          : [...session.selectedNeeds, id];
        persistSession({ ...session, selectedNeeds: selected });
      },
      confirmNeeds() {
        const needs = refineNeeds(session.selectedNeeds, session.answers);
        const matches = rankServices({
          needs,
          locality: session.locality,
          answers: session.answers,
          overrides: board.serviceOverrides,
        });
        const pathway = buildPathway(needs, matches);
        persistSession({
          ...session,
          selectedNeeds: needs,
          matches,
          pathway,
          nextSteps: buildNextSteps(pathway, matches),
        });
        persistBoard(
          logEvent(
            board,
            "pathway_created",
            `Pathway created with ${needs.length} need area(s).`,
          ),
        );
      },
      acknowledgeSafeguarding() {
        persistSession({ ...session, safeguardingAcknowledged: true });
      },
      requestReferral({ serviceId, contactName, contactPhone }) {
        const service = SERVICES.find((row) => row.id === serviceId);
        const referral = {
          id: newId("ref"),
          createdAt: new Date().toISOString(),
          serviceId,
          serviceName: service?.name ?? serviceId,
          story: session.story,
          locality: session.locality,
          status: "requested" as const,
          contactName,
          contactPhone,
        };
        persistSession({
          ...session,
          referrals: [referral, ...session.referrals],
        });
        persistBoard(
          logEvent(
            { ...board, referrals: [referral, ...board.referrals] },
            "referral_requested",
            `Referral requested to ${referral.serviceName}.`,
          ),
        );
      },
      requestNavigator({ reason, preferredContact }) {
        const navigatorCase = {
          id: newId("case"),
          createdAt: new Date().toISOString(),
          story: session.story,
          locality: session.locality,
          needs: session.selectedNeeds,
          reason,
          preferredContact,
          status: "open" as const,
        };
        persistSession({ ...session, navigatorCase });
        persistBoard(
          logEvent(
            { ...board, cases: [navigatorCase, ...board.cases] },
            "navigator_escalation",
            "Resident asked for a Community Navigator.",
          ),
        );
      },
      saveFollowUp(accessed, notes) {
        persistSession({
          ...session,
          followUp: { at: new Date().toISOString(), accessed, notes },
        });
        persistBoard(
          logEvent(
            board,
            "follow_up",
            `Resident follow-up: ${accessed}.`,
          ),
        );
      },
      updateService(serviceId, patch) {
        persistBoard(
          logEvent(
            {
              ...board,
              serviceOverrides: {
                ...board.serviceOverrides,
                [serviceId]: { ...board.serviceOverrides[serviceId], ...patch },
              },
            },
            "service_updated",
            `Service ${serviceId} updated.`,
          ),
        );
      },
      updateReferralStatus(id, status) {
        persistBoard({
          ...board,
          referrals: board.referrals.map((item) =>
            item.id === id ? { ...item, status } : item,
          ),
        });
      },
      updateCaseStatus(id, status) {
        persistBoard({
          ...board,
          cases: board.cases.map((item) =>
            item.id === id ? { ...item, status } : item,
          ),
        });
      },
      resetResident() {
        persistSession(emptySession());
      },
    };
  }, [board, ready, session]);

  return <LinkContext.Provider value={value}>{children}</LinkContext.Provider>;
}

export function useLink() {
  const ctx = useContext(LinkContext);
  if (!ctx) throw new Error("useLink must be used within LinkProvider");
  return ctx;
}
