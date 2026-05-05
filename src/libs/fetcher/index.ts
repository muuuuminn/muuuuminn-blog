const url = `${process.env.NEXT_PUBLIC_APP_ROOT_URL || ""}${
  process.env.NEXT_PUBLIC_APP_GITHUB_API_ENDPOINT || ""
}`;

type FetcherResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export const fetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit["headers"],
) => {
  return async (): Promise<TData> => {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ query, variables }),
      headers: {
        ...options,
      },
    });

    const json = (await res.json()) as FetcherResponse<TData>;

    if (json.errors && json.errors.length > 0) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    if (!json.data) {
      throw new Error("No data in response");
    }

    return json.data;
  };
};

export default fetcher;
