export class FetchError extends Error {
  public status!: number
  public info!: any

  constructor(m: string) {
    super(m)
  }
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json())
