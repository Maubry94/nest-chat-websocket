export interface AbstractUsecase<
	GenericInput extends object,
	GenericOutput extends unknown,
> {
	execute(input: GenericInput): Promise<GenericOutput>;
}
