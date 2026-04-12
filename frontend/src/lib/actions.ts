"use server";

import {
	CreateTransactionDocument,
	DeleteTransactionDocument,
	GetDaysDataDocument,
	GetLastDateDocument,
	GetYearlyDataDocument,
	UpdateTransactionDocument,
} from "@/graphql/generated/graphql";
import { fetcher } from "@/lib/fetcher";
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
import { Provider } from "@supabase/supabase-js";
import { format } from "date-fns";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

export const getDaysData = async (date: string) => {
	const variables: DaysDataQueryVariables = {
		range: { startDate: date, endDate: date },
	};
	const { id } = await getUser();
	const { Transactions, Total }: DaysDataQueryResponse = await fetcher(
		GetDaysDataDocument.toString(),
		variables,
		`${id}-${date}`,
	);
	return { Transactions, Total };
};

export const getLastDate = async () => {
	const { LastDate }: LastDateQueryResponse = await fetcher(
		GetLastDateDocument.toString(),
	);

	return LastDate;
};

export const getYearlyData = async (selectedYear: number) => {
	const variables: YearlyDataQueryVariables = {
		year: selectedYear,
		range: getRange(undefined, selectedYear),
	};

	const { id } = await getUser();

	const { TransactionsByMonth, Categories, Years }: YearlsDataQueryResponse =
		await fetcher(
			GetYearlyDataDocument.toString(),
			variables,
			`${id}-${selectedYear}`,
		);

	return { TransactionsByMonth, Categories, Years };
};

export const createTransaction = async (
	variables: CreateTransactionVariables,
) => {
	await fetcher(CreateTransactionDocument.toString(), variables);

	const {
		input: { date },
	} = variables;

	const { id } = await getUser();
	updateTag(`${id}-${format(date, "yyyy-MM-dd")}`);
	updateTag(`${id}-${format(date, "yyyy")}`);
	return { error: null };
};

export const updateTransactions = async (
	variables: UpdateTransactionVariables,
	oldDate: string,
) => {
	const {
		updateTransaction: { date },
	}: UpdateTransactionResponse = await fetcher(
		UpdateTransactionDocument.toString(),
		variables,
	);
	console.log(oldDate);
	const newYear = format(date, "yyyy");
	const oldYear = format(oldDate, "yyyy");
	const { id } = await getUser();

	updateTag(`${id}-${newYear}`);
	updateTag(`${id}-${format(date, "yyyy-MM-dd")}`);
	if (oldYear !== newYear) {
		updateTag(`${id}-${oldYear}`);
		updateTag(`${id}-${format(oldDate, "yyyy-MM-dd")}`);
	}
	return { error: null };
};

export const deleteTransaction = async (
	variables: DeleteTransactionVariables,
) => {
	const {
		deleteTransaction: { date },
	}: DeleteTransactionResponse = await fetcher(
		DeleteTransactionDocument.toString(),
		variables,
	);

	const { id } = await getUser();
	updateTag(`${id}-${format(date, "yyyy")}`);
	updateTag(`${id}-${format(date, "yyyy-MM-dd")}`);

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
