export const dateTag = (userId: string, date: string) =>
	`user:${userId}:date:${date}`;

export const lastDateTag = (userId: string) => `user:${userId}:lastDate`;

export const yearTag = (userId: string, year: string | number) =>
	`user:${userId}:year:${year}`;

export const yearsTag = (userId: string) => `user:${userId}:years`;
