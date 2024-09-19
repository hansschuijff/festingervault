// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
	| `/`
	| `/activation`
	| `/browse`
	| `/collection`
	| `/collection/:cid/:page?`
	| `/history/:page?`
	| `/item/:type/:page?`
	| `/item/:type/detail/:id/:tab?`
	| `/popular`
	| `/requests`
	| `/settings`
	| `/updates`;

export type Params = {
	"/collection/:cid/:page?": { cid: string; page?: string };
	"/history/:page?": { page?: string };
	"/item/:type/:page?": { type: string; page?: string };
	"/item/:type/detail/:id/:tab?": { type: string; id: string; tab?: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
	Path,
	Params,
	ModalPath
>();
export const { redirect } = utils<Path, Params>();
