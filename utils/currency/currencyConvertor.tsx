import axios from "axios";
import { BASE_URL } from "../apiHost";
import { useState } from "react";

type ConvertCurrencyProps = {
  amount: number;
  from: string;
  to: string;
};

const ConvertCurrency = async (props: ConvertCurrencyProps): Promise<number> => {
    let converted = props.amount;
    let rate = 1;
    await axios
    .get(
        `${BASE_URL}/api/v1/currency/convert?from=${props.from}&to=${props.to}`
    )
    .then((res) => {
        rate = res.data.data.rate;
    })
    .catch(() => {});
  converted *= rate;
  return Promise.resolve(converted);
};

export { ConvertCurrency };
