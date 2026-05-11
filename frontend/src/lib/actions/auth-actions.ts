"use server";

import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const login = async (formData: FormData) => {
	const supabase = await createClient();
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};
	const { error } = await supabase.auth.signInWithPassword(data);
	if (error) {
		redirect("/");
	}
	redirect("/");
};

export const signup = async (formData: FormData) => {
	const supabase = await createClient();
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		options: {
			data: {
				display_name: formData.get("name") as string,
			},
		},
	};
	const { error } = await supabase.auth.signUp(data);
	if (error) {
		redirect("/");
	}
	redirect("/");
};

export const oauth = async (provider: Provider) => {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth/callback`,
		},
	});

	if (data.url) {
		redirect(data.url);
	}
	if (error) {
		redirect("/");
	}
};

export const logout = async () => {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		return {
			success: false,
			message: "Something went wrong. Could not log out",
			date: Date.now(),
		};
	} else {
		return {
			success: true,
			message: "Logged out successfully",
			date: Date.now(),
		};
	}
};
