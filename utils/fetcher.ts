export class FetchError extends Error {
  public status!: number;
  public info!: any;

  constructor(m: string) {
    super(m);
  }
}

export const fetcher = async (...args: [RequestInfo, RequestInit]) => {
  try {
    const res = await fetch(...args);
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new FetchError(
        "An error occurred while fetching the data."
      );
      // Attach extra info to the error object.
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  } catch (error) {
    console.log(error.messsage);
    throw error;
  }
};
