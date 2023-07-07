import { UniqueEntityId } from '../value-objects/unique-entity-id';

export class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  get id() {
    return this._id;
  }
}
