import { AggregateRoot } from '@nestjs/cqrs';

export class ApiEndpoint extends AggregateRoot {
  readonly id: string;
  readonly path: string;
  readonly method: string;
  readonly action: string;
  readonly resource: string;
  readonly controller: string;
  readonly summary?: string;

  constructor(
    id: string,
    path: string,
    method: string,
    action: string,
    resource: string,
    controller: string,
    summary?: string,
  ) {
    super();
    this.id = id;
    this.path = path;
    this.method = method;
    this.action = action;
    this.resource = resource;
    this.controller = controller;
    this.summary = summary;
  }
}
