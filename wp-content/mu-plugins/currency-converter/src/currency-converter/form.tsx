
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { FormEvent } from 'react';
import type {
    ConversionResult,
    ConverterConfig,
} from './types';

//Props ek blueprint hai jo batata hai ki component ko kaunsa data milega
interface Props {
    config: ConverterConfig;
    idPrefix: string;
}

export function CurrencyConverterForm( { config, idPrefix }: Props ) {
    //useState — Converter ka data store karna
    const [ amount, setAmount ] = useState( '' );
    const [ from, setFrom ] = useState( config.defaultFrom );
    const [ to, setTo ] = useState( config.defaultTo );

    //API request chal rahi hai ya nahi, ye store karta hai.
    const [ isLoading, setIsLoading ] = useState( false );
    
    /**Isme API se aane wala conversion result store hota hai.
    ConversionResult | null ka matlab:
    Ya toh valid ConversionResult object hoga.
    Ya null hoga, matlab abhi result available nahi hai. */

    const [ result, setResult ] = useState< ConversionResult | null >( null );
    
    //Agar API fail hui ya koi problem aayi toh error message yahan store hoga.
    const [ error, setError ] = useState( '' );

    const isSubmitting = useRef( false );

    /**Kyunki is function ke andar API request ja rahi hai. API ka response aane mein time lag sakta hai.
    async ki wajah se hum await use kar sakte hain. */
    const handleSubmit = async (
        event: FormEvent< HTMLFormElement >
    ) => {
        //page reload nahi karna chahte.
        event.preventDefault();

        //Ye check karta hai ki pehle se koi request submit ho rahi hai ya nahi.
        if ( isSubmitting.current ) {
            return;
        }

        isSubmitting.current = true;//	Duplicate request rokna
        setIsLoading( true );// Loading start karna
        setResult( null ); //Purana result clear karna
        setError( '' );// Purana error clear karna

        /**AbortController();
        Ye browser ka built-in JavaScript feature hai.
        Iska use API request ko cancel karne ke liye hota hai. */
        const controller = new AbortController();
        const timeoutId = setTimeout( () => {
            controller.abort();
        }, 5000 );

        //Ab actual API connection
        try {
            //fetch() browser ka built-in function hai jo server ko HTTP request bhejta hai.
            const response = await fetch( config.restUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //JSON.stringify() is JavaScript object ko JSON string mein convert karta hai.
                body: JSON.stringify( {
                    amount,
                    from,
                    to,
                } ),
                signal: controller.signal,
            } );

            //API ka response receive karna
            /**Ek variable banaya jiska naam data hai.
            Isme API ka response store hoga.
            unknown ka matlab abhi response ka exact structure confirm nahi hai. */
            let data: unknown;

            try {
                //Server se jo JSON response aaya hai, usko JavaScript object mein convert kar raha hai.
                data = await response.json();
            } catch {
                throw new Error(
                    __( 'The server returned an invalid response.', 'currency-converter' )
                );
            }

            //API successful hui ya nahi
            if ( ! response.ok ) {
                const errorData = data as {
                    /**Iska matlab TypeScript ko bataya ja raha hai ki error response mein optional message property ho sakti hai. */
                    message?: string;
                };

                throw new Error(
                    /**Agar server ka apna error message available hai toh wahi show hoga.
                    Agar nahi hai toh default error message show hoga. */
                    errorData.message ||
                    __( 'Conversion failed. Please try again.', 'currency-converter' )
                );
            }

            setResult( data as ConversionResult );
        } catch ( requestError ) {
            //catch — Agar API fail ho gayi toh
            //Situation 1: Request timeout
            if (
                requestError instanceof Error &&
                requestError.name === 'AbortError'
            ) {
                setError(
                    __( 'The request timed out. Please try again.', 'currency-converter' )
                );
            } else if ( requestError instanceof Error ){
                //Situation 2: Normal JavaScript error
                setError( requestError.message );
            } else {
                //Situation 3: Unknown error
                setError(
                    __( 'A network error occurred. Please try again.', 'currency-converter' )
                );
            }
        } finally {
            //Request complete hone ke baad
            clearTimeout( timeoutId );
            isSubmitting.current = false;
            setIsLoading( false );
        }
    };

    //Currency dropdown ke options ban rahe hain
    const options = config.currencies.map( ( currency ) => (
        <option key={ currency.code } value={ currency.code }>
            { currency.label }
        </option>
    ) );

    //Ab actual UI render ho rahi hai
    return (
        <div className="devtask-cc">
            <form
                className="devtask-cc__form"
                onSubmit={ handleSubmit }
                noValidate // Browser ki default HTML validation disable karta hai.
            >
                <div className="devtask-cc__field">
                    <label htmlFor={ `${ idPrefix }-from` }>
                        { __( 'Send from', 'currency-converter' ) }
                    </label>
                    <select
                        id={ `${ idPrefix }-from` }
                        value={ from }
                        onChange={ ( event ) => setFrom( event.target.value ) }
                        disabled={ isLoading }
                    >
                        { options }
                    </select>
                </div>

                <div className="devtask-cc__field">
                    <label htmlFor={ `${ idPrefix }-amount` }>
                        { __( 'Amount', 'currency-converter' ) }
                    </label>
                    <input
                        id={ `${ idPrefix }-amount` }
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={ amount }
                        onChange={ ( event ) => setAmount( event.target.value ) }
                        disabled={ isLoading }
                    />
                </div>

                <div className="devtask-cc__field">
                    <label htmlFor={ `${ idPrefix }-to` }>
                        { __( 'Send to', 'currency-converter' ) }
                    </label>
                    <select
                        id={ `${ idPrefix }-to` }
                        value={ to }
                        onChange={ ( event ) => setTo( event.target.value ) }
                        disabled={ isLoading }
                    >
                        { options }
                    </select>
                </div>

                <button
                    type="submit"
                    className="devtask-cc__button"
                    disabled={ isLoading }
                >
                    { isLoading
                        ? __( 'Converting...', 'currency-converter' )
                        : __( 'Convert', 'currency-converter' ) }
                </button>
            </form>

            <div
                className="devtask-cc__feedback"
                aria-live="polite"
                aria-atomic="true"
            >
                { isLoading && (
                    <p>{ __( 'Fetching exchange rate...', 'currency-converter' ) }</p>
                ) }

                { error && (
                    <p role="alert">{ error }</p>
                ) }

                { result && (
                    <div className="devtask-cc__result">
                        <p>
                            { result.amount_formatted } { result.from }
                            {' = '}
                            <strong>{ result.converted_formatted } { result.to }</strong>
                        </p>

                        <p>
                            { __( 'Exchange rate:', 'currency-converter' ) }
                            {' '}
                            1 { result.from } = { result.rate_formatted } { result.to }
                        </p>

                        <p>
                            { __( 'Rate date:', 'currency-converter' ) }
                            {' '}
                            { result.rate_date }
                        </p>
                    </div>
                ) }
            </div>
        </div>
    );
}
