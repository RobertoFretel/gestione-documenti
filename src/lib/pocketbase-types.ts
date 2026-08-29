/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export const Collections = {
  Authorigins: "_authOrigins",
  Externalauths: "_externalAuths",
  Mfas: "_mfas",
  Otps: "_otps",
  Superusers: "_superusers",
  Account: "account",
  CategoryDocs: "categoryDocs",
  Documents: "documents",
  PbUser: "pb_user",
  Session: "session",
  User: "user",
  Verification: "verification",
} as const
export type Collections = typeof Collections[keyof typeof Collections]

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
  ? T extends unknown
    ? { expand?: unknown }
    : { expand: T }
  : { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
  id: RecordIdString
  collectionId: string
  collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
  email: string
  emailVisibility: boolean
  username: string
  verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
  collectionRef: string
  created: IsoAutoDateString
  fingerprint: string
  id: string
  recordRef: string
  updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
  collectionRef: string
  created: IsoAutoDateString
  id: string
  provider: string
  providerId: string
  recordRef: string
  updated: IsoAutoDateString
}

export type MfasRecord = {
  collectionRef: string
  created: IsoAutoDateString
  id: string
  method: string
  recordRef: string
  updated: IsoAutoDateString
}

export type OtpsRecord = {
  collectionRef: string
  created: IsoAutoDateString
  id: string
  password: string
  recordRef: string
  sentTo?: string
  updated: IsoAutoDateString
}

export type SuperusersRecord = {
  created: IsoAutoDateString
  email: string
  emailVisibility?: boolean
  id: string
  password: string
  tokenKey: string
  updated: IsoAutoDateString
  verified?: boolean
}

export type AccountRecord = {
  accessToken?: string
  accessTokenExpiresAt?: IsoDateString
  accountId: string
  createdAt: IsoDateString
  id: string
  idToken?: string
  password?: string
  providerId: string
  refreshToken?: string
  refreshTokenExpiresAt?: IsoDateString
  scope?: string
  updatedAt: IsoDateString
  userId: string
}

/** Struttura del singolo oggetto contenuto nell'array docs della View */
export type CategoryDocItem = {
  id: string
  titolo: string
  descrizione?: string
}

export type CategoryDocsRecord<Tcategoria = string, Tdocs = CategoryDocItem[]> = {
  categoria?: null | Tcategoria
  docs?: null | Tdocs
  id: string
  total_docs?: number
  userId?: RecordIdString
}

export type DocumentsRecord = {
  attachments?: FileNameString[]
  categoria?: string
  created: IsoAutoDateString
  descrizione?: string
  docTime: IsoDateString
  favorite?: boolean
  id: string
  titolo: string
  updated: IsoAutoDateString
  userId?: RecordIdString
}

export type PbUserRecord = {
  created: IsoAutoDateString
  email: string
  emailVisibility?: boolean
  id: string
  password: string
  tokenKey: string
  updated: IsoAutoDateString
  verified?: boolean
}

export type SessionRecord = {
  createdAt: IsoDateString
  expiresAt: IsoDateString
  id: string
  ipAddress?: string
  token: string
  updatedAt: IsoDateString
  userAgent?: string
  userId: string
}

export type UserRecord = {
  createdAt: IsoDateString
  email: string
  emailVerified?: boolean
  id: string
  image?: string
  name?: string
  updatedAt: IsoDateString
}

export type VerificationRecord = {
  createdAt?: IsoDateString
  expiresAt: IsoDateString
  id: string
  identifier: string
  updatedAt?: IsoDateString
  value: string
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AccountResponse<Texpand = unknown> = Required<AccountRecord> & BaseSystemFields<Texpand>
export type CategoryDocsResponse<Tcategoria = string, Tdocs = CategoryDocItem[], Texpand = unknown> = Required<CategoryDocsRecord<Tcategoria, Tdocs>> & BaseSystemFields<Texpand>
export type DocumentsResponse<Texpand = unknown> = Required<DocumentsRecord> & BaseSystemFields<Texpand>
export type PbUserResponse<Texpand = unknown> = Required<PbUserRecord> & AuthSystemFields<Texpand>
export type SessionResponse<Texpand = unknown> = Required<SessionRecord> & BaseSystemFields<Texpand>
export type UserResponse<Texpand = unknown> = Required<UserRecord> & BaseSystemFields<Texpand>
export type VerificationResponse<Texpand = unknown> = Required<VerificationRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  _authOrigins: AuthoriginsRecord
  _externalAuths: ExternalauthsRecord
  _mfas: MfasRecord
  _otps: OtpsRecord
  _superusers: SuperusersRecord
  account: AccountRecord
  categoryDocs: CategoryDocsRecord
  documents: DocumentsRecord
  pb_user: PbUserRecord
  session: SessionRecord
  user: UserRecord
  verification: VerificationRecord
}

export type CollectionResponses = {
  _authOrigins: AuthoriginsResponse
  _externalAuths: ExternalauthsResponse
  _mfas: MfasResponse
  _otps: OtpsResponse
  _superusers: SuperusersResponse
  account: AccountResponse
  categoryDocs: CategoryDocsResponse
  documents: DocumentsResponse
  pb_user: PbUserResponse
  session: SessionResponse
  user: UserResponse
  verification: VerificationResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
  // Omit AutoDate fields
  [K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
    // Convert FileNameString to File
    T[K] extends infer U ? 
      U extends (FileNameString | FileNameString[]) ? 
        U extends any[] ? File[] : File 
      : U
    : never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
  id?: RecordIdString
  email: string
  emailVisibility?: boolean
  password: string
  passwordConfirm: string
  verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
  id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
  Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
  email?: string
  emailVisibility?: boolean
  oldPassword?: string
  password?: string
  passwordConfirm?: string
  verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
  Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
  CollectionResponses[T] extends AuthSystemFields
    ? CreateAuth<CollectionRecords[T]>
    : CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
  CollectionResponses[T] extends AuthSystemFields
    ? UpdateAuth<CollectionRecords[T]>
    : UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
  collection<T extends keyof CollectionResponses>(
    idOrName: T
  ): RecordService<CollectionResponses[T]>
} & PocketBase