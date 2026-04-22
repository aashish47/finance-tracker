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
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { format } from "date-fns";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

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
	return { error: null };
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

	return { error: null };
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
