// ==================== TIPOS BASE ====================

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
}

// ==================== ARTIST ====================

export interface Artist {
  ArtistId: number;
  Name: string | null;
}

export interface ArtistList {
  artists: Artist[];
  total: number;
  page: number;
  page_size: number;
}

// ==================== ALBUM ====================

export interface Album {
  AlbumId: number;
  Title: string;
  ArtistId: number;
}

export interface AlbumDetail extends Album {
  artist: Artist | null;
  tracks?: Track[];
}

export interface AlbumList {
  albums: AlbumDetail[];
  total: number;
  page: number;
  page_size: number;
}

export interface AlbumFilters extends SearchParams {
  artist_id?: number;
}

// ==================== GENRE ====================

export interface Genre {
  GenreId: number;
  Name: string | null;
}

export interface GenreList {
  genres: Genre[];
  total: number;
}

// ==================== TRACK ====================

export interface Track {
  TrackId: number;
  Name: string;
  AlbumId: number | null;
  MediaTypeId: number;
  GenreId: number | null;
  Composer: string | null;
  Milliseconds: number;
  UnitPrice: string;
}

export interface TrackDetail extends Track {
  album: Album | null;
  artist_name: string | null;
  genre_name: string | null;
}

export interface TrackList {
  tracks: TrackDetail[];
  total: number;
  page: number;
  page_size: number;
}

export interface TrackFilters extends SearchParams {
  album_id?: number;
  genre_id?: number;
}

// ==================== CUSTOMER ====================

export interface Customer {
  CustomerId: number;
  FirstName: string;
  LastName: string;
  Company: string | null;
  Address: string | null;
  City: string | null;
  State: string | null;
  Country: string | null;
  PostalCode: string | null;
  Phone: string | null;
  Fax: string | null;
  Email: string;
  SupportRepId: number | null;
}

export interface CustomerCreate {
  FirstName: string;
  LastName: string;
  Email: string;
  Company?: string | null;
  Address?: string | null;
  City?: string | null;
  State?: string | null;
  Country?: string | null;
  PostalCode?: string | null;
  Phone?: string | null;
  Fax?: string | null;
  SupportRepId?: number | null;
}

export interface CustomerUpdate {
  FirstName?: string;
  LastName?: string;
  Company?: string | null;
  Address?: string | null;
  City?: string | null;
  State?: string | null;
  Country?: string | null;
  PostalCode?: string | null;
  Phone?: string | null;
  Fax?: string | null;
  Email?: string;
  SupportRepId?: number | null;
}

export interface CustomerList {
  customers: Customer[];
  total: number;
  page: number;
  page_size: number;
}

// ==================== INVOICE ====================

export interface Invoice {
  InvoiceId: number;
  CustomerId: number;
  InvoiceDate: string;
  BillingAddress: string | null;
  BillingCity: string | null;
  BillingState: string | null;
  BillingCountry: string | null;
  BillingPostalCode: string | null;
  Total: string;
  EmployeeId: number | null;
}

export interface InvoiceItemCreate {
  TrackId: number;
  Quantity?: number;
}

export interface InvoiceCreate {
  CustomerId: number;
  EmployeeId?: number | null;
  BillingAddress?: string | null;
  BillingCity?: string | null;
  BillingState?: string | null;
  BillingCountry?: string | null;
  BillingPostalCode?: string | null;
  items: InvoiceItemCreate[];
}

export interface InvoiceItemDetail {
  InvoiceLineId: number;
  InvoiceId: number;
  TrackId: number;
  UnitPrice: string;
  Quantity: number;
  track_name: string | null;
  artist_name: string | null;
  album_title: string | null;
}

export interface InvoiceDetail extends Invoice {
  items: InvoiceItemDetail[];
  customer_name: string | null;
  employee_name: string | null;
}

export interface InvoiceList {
  invoices: Invoice[];
  total: number;
  page: number;
  page_size: number;
}

export interface InvoiceFilters extends PaginationParams {
  customer_id?: number;
  employee_id?: number;
  start_date?: string;
  end_date?: string;
}

// ==================== STATS ====================

export interface TopTrack {
  TrackId: number;
  Name: string;
  total_sales: string;
  units_sold: number;
  artist_name: string | null;
}

export interface TopGenre {
  GenreId: number;
  Name: string | null;
  total_sales: string;
  tracks_sold: number;
}

export interface TopCustomer {
  CustomerId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  total_spent: string;
  total_purchases: number;
}

export interface SalesByEmployee {
  EmployeeId: number | null;
  employee_name: string | null;
  total_sales: string;
  total_invoices: number;
}

export interface MonthlySales {
  year: number;
  month: number;
  total_sales: string;
  total_invoices: number;
}

export interface TopTracksResponse {
  tracks: TopTrack[];
  limit: number;
}

export interface TopGenresResponse {
  genres: TopGenre[];
  limit: number;
}

export interface TopCustomersResponse {
  customers: TopCustomer[];
  limit: number;
}

export interface SalesByEmployeeResponse {
  sales: SalesByEmployee[];
}

export interface MonthlySalesResponse {
  sales: MonthlySales[];
  start_date: string | null;
  end_date: string | null;
}

// ==================== ERROR HANDLING ====================

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ApiError {
  detail: string;
  status?: number;
  message?: string;
}

// ==================== CUSTOMER ====================

// ... (tus tipos existentes de Customer)

export interface CustomerPurchaseHistoryItem {
  purchase_id: number;
  employee_id: number | null;
  billing_address: string | null;
}