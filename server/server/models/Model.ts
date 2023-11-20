import ModelSchema from "../schemes/ModelSchema";

export default interface Model {
    all(): Array<ModelSchema>

    findById(id: number): ModelSchema | undefined;

    create(object: ModelSchema): ModelSchema;

    update(object: ModelSchema): ModelSchema;

    delete(id: number): void;
}