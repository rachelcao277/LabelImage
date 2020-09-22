
import http from '@/axios/http-request.ts';
import { CommonResult } from 'types/global/api';

interface GetCustomerListParams {
  keyword?: string;
  gender?: 1 | 2;
  age_from?: number;
  age_to?: number;
  has_mobile?: 0 | 1 | -1;
  has_face?: 0 | 1 | -1;
  page?: number;
  per_page?: number;
}
interface CustomerRes {
  data: any; link: any; meta: any;
}
export async function getCustomerList(params: GetCustomerListParams, mock = false): Promise<CommonResult<CustomerRes>> {
  const data = await http.request<CustomerRes>('/business/customers', {
    method: 'get',
    params,
  }, mock);
  return data;
}
