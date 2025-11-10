import { ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

interface BATPrice {
  usd: number;
  usd_24h_change: number;
}

const fetchBATPrice = async (): Promise<BATPrice> => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price",
    {
      params: {
        ids: "basic-attention-token",
        vs_currencies: "usd",
        include_24hr_change: true,
      },
    }
  );

  const data = response.data["basic-attention-token"];

  return {
    usd: data.usd,
    usd_24h_change: data.usd_24h_change,
  };
};

export function useBATPrice() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bat-price"],
    queryFn: fetchBATPrice,
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  const batPrice = ref(data);
  const isLoadingPrice = ref(isLoading);
  const priceError = ref(error);

  const formatPrice = (price: number | undefined) => {
    if (!price) return "$0.00";
    return `$${price.toFixed(4)}`;
  };

  const formatChange = (change: number | undefined) => {
    if (!change) return "0.00%";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  const changeColor = (change: number | undefined) => {
    if (!change) return "text-neutral-400";
    return change > 0 ? "text-green-600" : "text-red-600";
  };

  return {
    batPrice,
    isLoadingPrice,
    priceError,
    formatPrice,
    formatChange,
    changeColor,
    refetch,
  };
}
