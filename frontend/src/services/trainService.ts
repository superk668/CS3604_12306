import { get } from './api';

export interface SeatInfoItem {
  totalSeats: number;
  availableSeats: number;
  price: number;
  isAvailable: boolean;
}

export interface TrainDetail {
  trainNumber: string;
  trainType: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  seatInfo: Record<string, SeatInfoItem>;
}

// 获取车次详情（含座位信息）
export const getTrainDetail = async (
  trainNumber: string,
  date: string
): Promise<TrainDetail> => {
  const resp = await get(`/trains/${encodeURIComponent(trainNumber)}?date=${encodeURIComponent(date)}`);
  return resp.data.train as TrainDetail;
};