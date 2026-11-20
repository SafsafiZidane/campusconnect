import { HelpRequestId } from "./help-request-id";
import { UserId } from "../user/user-id";
import {
  TitreDemandeInvalideError,
  DescriptionDemandeInvalideError,
  ChampsObligatoiresManquantsError,
  ActionNonAutoriseeError,
  DemandeDejaClotureeError,
  DemandePasEnCoursError,
} from "./help-request-errors";

export type HelpRequestStatus = "OPEN" | "ACCEPTED" | "COMPLETED";

export interface HelpRequestProps {
  title: string;
  description: string;
  subject: string;
  level: string;
  availability: string;
  status: HelpRequestStatus;
  authorId: UserId;
  selectedHelperId?: UserId;
  isReported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHelpRequestProps {
  title: string;
  description: string;
  subject: string;
  level: string;
  availability: string;
  authorId: UserId;
}

export class HelpRequest {
  private constructor(
    readonly id: HelpRequestId,
    private props: HelpRequestProps
  ) {}

  static create(props: CreateHelpRequestProps): HelpRequest {
    const trimmedTitle = props.title.trim();
    if (trimmedTitle.length < 5) {
      throw new TitreDemandeInvalideError();
    }

    const trimmedDesc = props.description.trim();
    if (trimmedDesc.length < 10) {
      throw new DescriptionDemandeInvalideError();
    }

    const trimmedSubject = props.subject.trim();
    const trimmedLevel = props.level.trim();
    const trimmedAvailability = props.availability.trim();

    if (!trimmedSubject || !trimmedLevel || !trimmedAvailability) {
      throw new ChampsObligatoiresManquantsError("matière, niveau ou disponibilité");
    }

    const now = new Date();
    return new HelpRequest(HelpRequestId.next(), {
      title: trimmedTitle,
      description: trimmedDesc,
      subject: trimmedSubject,
      level: trimmedLevel,
      availability: trimmedAvailability,
      status: "OPEN",
      authorId: props.authorId,
      isReported: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(id: HelpRequestId, props: HelpRequestProps): HelpRequest {
    return new HelpRequest(id, props);
  }

  modify(
    requesterId: UserId,
    data: {
      title?: string;
      description?: string;
      subject?: string;
      level?: string;
      availability?: string;
    }
  ): void {
    if (!this.props.authorId.equals(requesterId)) {
      throw new ActionNonAutoriseeError("Seul l'auteur peut modifier cette demande.");
    }

    if (this.props.status === "COMPLETED") {
      throw new DemandeDejaClotureeError();
    }

    if (data.title !== undefined) {
      const trimmed = data.title.trim();
      if (trimmed.length < 5) throw new TitreDemandeInvalideError();
      this.props.title = trimmed;
    }

    if (data.description !== undefined) {
      const trimmed = data.description.trim();
      if (trimmed.length < 10) throw new DescriptionDemandeInvalideError();
      this.props.description = trimmed;
    }

    if (data.subject !== undefined) {
      this.props.subject = data.subject.trim();
    }

    if (data.level !== undefined) {
      this.props.level = data.level.trim();
    }

    if (data.availability !== undefined) {
      this.props.availability = data.availability.trim();
    }

    this.props.updatedAt = new Date();
  }

  acceptProposal(requesterId: UserId, helperId: UserId): void {
    if (!this.props.authorId.equals(requesterId)) {
      throw new ActionNonAutoriseeError("Seul l'auteur de la demande peut accepter une proposition d'aide.");
    }

    if (this.props.status !== "OPEN") {
      throw new ActionNonAutoriseeError(
        "Cette demande n'est plus ouverte aux propositions."
      );
    }

    if (this.props.authorId.equals(helperId)) {
      throw new ActionNonAutoriseeError(
        "L'auteur ne peut pas accepter sa propre proposition."
      );
    }

    this.props.status = "ACCEPTED";
    this.props.selectedHelperId = helperId;
    this.props.updatedAt = new Date();
  }

  completeSession(requesterId: UserId): void {
    // Only author or selected helper can mark as completed
    const isAuthor = this.props.authorId.equals(requesterId);
    const isHelper = this.props.selectedHelperId?.equals(requesterId) ?? false;

    if (!isAuthor && !isHelper) {
      throw new ActionNonAutoriseeError(
        "Seuls les participants à la séance peuvent la marquer comme terminée."
      );
    }

    if (this.props.status !== "ACCEPTED") {
      throw new DemandePasEnCoursError();
    }

    this.props.status = "COMPLETED";
    this.props.updatedAt = new Date();
  }

  markAsReported(): void {
    this.props.isReported = true;
    this.props.updatedAt = new Date();
  }

  clearReported(): void {
    this.props.isReported = false;
    this.props.updatedAt = new Date();
  }

  isParticipant(userId: UserId): boolean {
    return (
      this.props.authorId.equals(userId) ||
      (this.props.selectedHelperId ? this.props.selectedHelperId.equals(userId) : false)
    );
  }

  canReceiveProposals(): boolean {
    return this.props.status === "OPEN";
  }

  isCompleted(): boolean {
    return this.props.status === "COMPLETED";
  }

  snapshot(): {
    id: string;
    title: string;
    description: string;
    subject: string;
    level: string;
    availability: string;
    status: HelpRequestStatus;
    authorId: string;
    selectedHelperId?: string;
    isReported: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id.value,
      title: this.props.title,
      description: this.props.description,
      subject: this.props.subject,
      level: this.props.level,
      availability: this.props.availability,
      status: this.props.status,
      authorId: this.props.authorId.value,
      selectedHelperId: this.props.selectedHelperId?.value,
      isReported: this.props.isReported,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
