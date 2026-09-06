import axios, { type AxiosRequestConfig } from "axios"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

export type AuthUser = { id: number; name: string | null; email: string }
export type User = AuthUser & {
  phone: string
  role: "ADMIN" | "USER"
  createdAt: string
  updatedAt: string
}

export type Client = {
  id: number
  name: string
  email: string
  phone: string | null
  companyName: string | null
  address: string | null
  userId: number
  createdAt: string
  updatedAt: string
}

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"

export type Invoice = {
  id: number
  invoiceNumber: string
  clientId: number
  userId: number
  issueDate: string
  dueDate: string
  status: InvoiceStatus
  subtotal: number | string
  tax: number | string
  total: number | string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type InvoiceItem = {
  id: number
  invoiceId: number
  description: string
  quantity: number
  unitPrice: number | string
  amount: number | string
}

export type InvoiceDetails = Invoice & {
  items: InvoiceItem[]
  client: Client
  user: User
}

export function getInvoiceDisplayStatus(
  invoice: Pick<Invoice, "status" | "dueDate">
): InvoiceStatus {
  if (invoice.status === "PAID" || invoice.status === "CANCELLED") {
    return invoice.status
  }

  const dueDate = new Date(`${invoice.dueDate.slice(0, 10)}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return dueDate < today ? "OVERDUE" : invoice.status
}

type LoginResponse = AuthUser & { accessToken: string }

export function getStoredAuth() {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem("invoicr_auth")
  return raw ? (JSON.parse(raw) as LoginResponse) : null
}

export function storeAuth(auth: LoginResponse) {
  window.localStorage.setItem("invoicr_auth", JSON.stringify(auth))
}

export function clearStoredAuth() {
  window.localStorage.removeItem("invoicr_auth")
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const auth = getStoredAuth()

  if (auth) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }

  return config
})

async function request<T>(path: string, config: AxiosRequestConfig = {}) {
  try {
    const response = await api.request<T>({
      url: path,
      ...config,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseMessage = error.response?.data?.message
      const message = Array.isArray(responseMessage)
        ? responseMessage.join(", ")
        : responseMessage

      throw new Error(message || "Something went wrong. Please try again.")
    }

    throw error
  }
}

export function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    data: { email, password },
  })
}

export async function register(input: {
  name: string
  email: string
  phone: string
  password: string
}) {
  await request("/auth/register", {
    method: "POST",
    data: input,
  })
  return login(input.email, input.password)
}

export function getProfile(userId: number) {
  return request<User>(`/users/${userId}`)
}

export function updateProfile(
  userId: number,
  input: Pick<User, "name" | "email" | "phone">
) {
  return request<User>(`/users/${userId}`, {
    method: "PATCH",
    data: input,
  })
}

export function getClients() {
  return request<Client[]>("/clients")
}

export function getClient(clientId: number) {
  return request<Client>(`/clients/${clientId}`)
}

export function updateClient(
  clientId: number,
  input: Partial<
    Pick<Client, "name" | "email" | "phone" | "companyName" | "address">
  >
) {
  return request<Client>(`/clients/${clientId}`, {
    method: "PATCH",
    data: input,
  })
}

export function getInvoices() {
  return request<Invoice[]>("/invoices")
}

export function getInvoice(invoiceId: number) {
  return request<InvoiceDetails>(`/invoices/${invoiceId}`)
}

export function updateInvoice(
  invoiceId: number,
  input: Partial<
    Pick<
      Invoice,
      "dueDate" | "issueDate" | "status" | "subtotal" | "tax" | "notes"
    >
  > & {
    items?: Array<{
      description: string
      quantity?: number
      unitPrice: number
    }>
  }
) {
  return request<Invoice>(`/invoices/${invoiceId}`, {
    method: "PATCH",
    data: input,
  })
}

export function createClient(input: {
  name: string
  email: string
  phone?: string
  companyName?: string
  address?: string
}) {
  return request<Client>("/clients", {
    method: "POST",
    data: input,
  })
}

export function createInvoice(input: {
  clientId: number
  dueDate: string
  issueDate?: string
  subtotal: number
  tax: number
  status?: InvoiceStatus
  notes?: string
  items: Array<{
    description: string
    quantity?: number
    unitPrice: number
  }>
}) {
  return request<Invoice>("/invoices", {
    method: "POST",
    data: input,
  })
}
