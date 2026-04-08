import { createClient } from "@/utils/supabase/server";

export const getUser = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("User null");
	}
	return user;
};
