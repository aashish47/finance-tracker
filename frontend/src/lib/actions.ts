"use server";

import createTransactionMutation from "@/graphql/createTransaction.graphql";
import deleteTransactionMutation from "@/graphql/deleteTransaction.graphql";
import getDaysDataQuery from "@/graphql/getDaysData.graphql";
import getLastDateQuery from "@/graphql/getLastDate.graphql";
import getYearlyDataQuery from "@/graphql/getYearlyData.graphql";
import updateTransactionMutation from "@/graphql/updateTransaction.graphql";
import { request } from "@/lib/request";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
	CreateTransactionVariables,
	DaysDataQueryResponse,
	DaysDataQueryVariables,
	DeleteTransactionResponse,
	DeleteTransactionVariables,
	LastDateQueryResponse,
	UpdateTransactionResponse,
	UpdateTransactionVariables,
	YearlsDataQueryResponse,
	YearlyDataQueryVariables,
} from "@/types/types";
import { getRange } from "@/utils/getRange";
import { getUser } from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { revalidateTag } from "next/cache";

export const getDaysData = async (date: string) => {
	const variables: DaysDataQueryVariables = {
		range: { startDate: date, endDate: date },
	};
	const { id } = await getUser();
	const { Transactions, Total }: DaysDataQueryResponse = await request(
		getDaysDataQuery,
		variables,
		"force-cache",
		[`${id}-${date}`],
	);
	return { Transactions, Total };
};

export const getLastDate = async () => {
	const { LastDate }: LastDateQueryResponse = await request(getLastDateQuery);

	return LastDate;
};

export const getYearlyData = async (selectedYear: number) => {
	const variables: YearlyDataQueryVariables = {
		year: selectedYear,
		range: getRange(undefined, selectedYear),
	};

	const { id } = await getUser();

	const { TransactionsByMonth, Categories, Years }: YearlsDataQueryResponse =
		await request(getYearlyDataQuery, variables, "force-cache", [
			`${id}-${selectedYear}`,
		]);

	return { TransactionsByMonth, Categories, Years };
};

export const createTransaction = async (
	variables: CreateTransactionVariables,
) => {
	await request(createTransactionMutation, variables);

	const {
		input: { date },
	} = variables;

	const { id } = await getUser();
	revalidateTag(`${id}-${format(date, "yyyy-MM-dd")}`);
	revalidateTag(`${id}-${format(date, "yyyy")}`);
	return { error: null };
};

export const updateTransactions = async (
	variables: UpdateTransactionVariables,
	oldDate: string,
) => {
	const {
		updateTransaction: { date },
	}: UpdateTransactionResponse = await request(
		updateTransactionMutation,
		variables,
	);
	console.log(oldDate);
	const newYear = format(date, "yyyy");
	const oldYear = format(oldDate, "yyyy");
	const { id } = await getUser();

	revalidateTag(`${id}-${newYear}`);
	revalidateTag(`${id}-${format(date, "yyyy-MM-dd")}`);
	if (oldYear !== newYear) {
		revalidateTag(`${id}-${oldYear}`);
		revalidateTag(`${id}-${format(oldDate, "yyyy-MM-dd")}`);
	}
	return { error: null };
};

export const deleteTransaction = async (
	variables: DeleteTransactionVariables,
) => {
	const {
		deleteTransaction: { date },
	}: DeleteTransactionResponse = await request(
		deleteTransactionMutation,
		variables,
	);

	const { id } = await getUser();
	revalidateTag(`${id}-${format(date, "yyyy")}`);
	revalidateTag(`${id}-${format(date, "yyyy-MM-dd")}`);

	return { error: null };
};

export const login = async (formData: FormData) => {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
};

export const signup = async (formData: FormData) => {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
};

export const oauth = async (provider: Provider) => {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth/callback/`,
		},
	});

	if (data.url) {
		redirect(data.url);
	}
	if (error) {
		redirect("/error");
	}
};
