import { api } from "./api";

export type TaxRecord = {
  requesterId: string;
  requesterName: string;
  amount: number;
  exceedsKu30Limit: boolean;
};

export type TaxRecordRequester = {
  helperId: string;
  helperName: string;
  amount: number;
  requiresKu30: boolean;
};

export type HelperReport = {
  year: number;
  helperId: string;
  totalEarnings: number;
  requiresT2Declaration: boolean;
  mayRequireVatRegistration: boolean;
  records: TaxRecord[];
};

export type RequesterReport = {
  year: number;
  requesterId: string;
  totalPaid: number;
  records: TaxRecordRequester[];
};

export function fetchHelperReport(year?: number) {
  const params = year ? `?year=${year}` : "";
  return api<HelperReport>(`/tax/helper-report${params}`);
}

export function fetchRequesterReport(year?: number) {
  const params = year ? `?year=${year}` : "";
  return api<RequesterReport>(`/tax/requester-report${params}`);
}
