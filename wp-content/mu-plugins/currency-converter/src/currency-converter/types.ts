
export interface CurrencyOption {
	code: string;
	label: string;
}

export interface ConverterConfig {
	restUrl: string;
	currencies: CurrencyOption[];
	defaultFrom: string;
	defaultTo: string;
}

export interface ConversionResult {
	from: string;
	to: string;
	amount: number;
	converted: number;
	rate: number;
	rate_date: string;
	amount_formatted: string;
	converted_formatted: string;
	rate_formatted: string;
}
