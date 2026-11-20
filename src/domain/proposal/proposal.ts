import { ProposalId } from "./proposal-id";
import { HelpRequestId } from "../help-request/help-request-id";
import { UserId } from "../user/user-id";
import {
  MessagePropositionTropCourtError,
  PropositionDejaTraiteeError,
} from "./proposal-errors";

export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ProposalProps {
  message: string;
  proposedAvailability?: string;
  status: ProposalStatus;
  requestId: HelpRequestId;
  helperId: UserId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProposalProps {
  message: string;
  proposedAvailability?: string;
  requestId: HelpRequestId;
  helperId: UserId;
}

export class Proposal {
  private constructor(
    readonly id: ProposalId,
    private props: ProposalProps
  ) {}

  static create(props: CreateProposalProps): Proposal {
    const trimmedMessage = props.message.trim();
    if (trimmedMessage.length < 5) {
      throw new MessagePropositionTropCourtError();
    }

    const now = new Date();
    return new Proposal(ProposalId.next(), {
      message: trimmedMessage,
      proposedAvailability: props.proposedAvailability?.trim(),
      status: "PENDING",
      requestId: props.requestId,
      helperId: props.helperId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(id: ProposalId, props: ProposalProps): Proposal {
    return new Proposal(id, props);
  }

  accept(): void {
    if (this.props.status !== "PENDING") {
      throw new PropositionDejaTraiteeError();
    }
    this.props.status = "ACCEPTED";
    this.props.updatedAt = new Date();
  }

  reject(): void {
    if (this.props.status !== "PENDING") {
      throw new PropositionDejaTraiteeError();
    }
    this.props.status = "REJECTED";
    this.props.updatedAt = new Date();
  }

  isPending(): boolean {
    return this.props.status === "PENDING";
  }

  snapshot(): {
    id: string;
    message: string;
    proposedAvailability?: string;
    status: ProposalStatus;
    requestId: string;
    helperId: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id.value,
      message: this.props.message,
      proposedAvailability: this.props.proposedAvailability,
      status: this.props.status,
      requestId: this.props.requestId.value,
      helperId: this.props.helperId.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
