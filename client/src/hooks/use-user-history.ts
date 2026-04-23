import { useQuery } from "@tanstack/react-query";
import { Order, OrderItem, Reservation } from "@shared/schema";

export function useUserOrders() {
  return useQuery<(Order & { items: OrderItem[] })[]>({
    queryKey: ["/api/user/orders"],
  });
}

export function useUserReservations() {
  return useQuery<Reservation[]>({
    queryKey: ["/api/user/reservations"],
  });
}
