"use server";

import {
	CreateTransactionDocument,
	CreateTransactionMutationVariables,
	DeleteTransactionDocument,
	DeleteTransactionMutation,
	DeleteTransactionMutationVariables,
	UpdateTransactionDocument,
	UpdateTransactionMutation,
	UpdateTransactionMutationVariables,
} from "@/graphql/generated/graphql";
import { getSession, getUser } from "@/lib/auth";
import { fetcher } from "@/lib/data/fetcher";
import { dateTag, lastDateTag, yearsTag, yearTag } from "@/lib/data/tags";
import { format } from "date-fns";
import { updateTag } from "next/cache";

export const createTransaction = async (
	variables: CreateTransactionMutationVariables,
) => {
	const { access_token } = await getSession();
	await fetcher(
		CreateTransactionDocument.toString(),
		variables,
		undefined,
		access_token,
	);

	const {
		input: { date },
	} = variables;

	const { id } = await getUser();
	updateTag(yearsTag(id));
	updateTag(lastDateTag(id));
	updateTag(dateTag(id, format(date, "yyyy-MM-dd")));
	updateTag(yearTag(id, format(date, "yyyy")));
};

export const updateTransactions = async (
	variables: UpdateTransactionMutationVariables,
	oldDate: string,
) => {
	const { access_token } = await getSession();
	const { updateTransaction }: UpdateTransactionMutation = await fetcher(
		UpdateTransactionDocument.toString(),
		variables,
		undefined,
		access_token,
	);

	const date = updateTransaction ? updateTransaction?.date : "";

	const newYear = format(date, "yyyy");
	const oldYear = format(oldDate, "yyyy");
	const { id } = await getUser();

	updateTag(yearsTag(id));
	updateTag(lastDateTag(id));
	updateTag(yearTag(id, newYear));
	updateTag(dateTag(id, format(date, "yyyy-MM-dd")));
	updateTag(yearTag(id, oldYear));
	updateTag(dateTag(id, format(oldDate, "yyyy-MM-dd")));
};

export const deleteTransaction = async (
	variables: DeleteTransactionMutationVariables,
) => {
	const { access_token } = await getSession();
	const { deleteTransaction }: DeleteTransactionMutation = await fetcher(
		DeleteTransactionDocument.toString(),
		variables,
		undefined,
		access_token,
	);

	const date = deleteTransaction ? deleteTransaction.date : "";

	const { id } = await getUser();

	updateTag(yearsTag(id));
	updateTag(lastDateTag(id));
	updateTag(yearTag(id, format(date, "yyyy")));
	updateTag(dateTag(id, format(date, "yyyy-MM-dd")));
};
