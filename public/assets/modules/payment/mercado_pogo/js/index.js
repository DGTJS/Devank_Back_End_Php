const publicKey = document.getElementById("mercado-pago-public-key").value;
const mercadopago = new MercadoPago(publicKey);

function loadCardForm() {
    const productCost = document.getElementById('amount').value;
    const productDescription = document.getElementById('product-description').innerText;

    const cardForm = mercadopago.cardForm({
        amount: productCost,
        autoMount: true,
        form: {
               id: "form-checkout",
                cardholderName: {
                    id: "form-checkout__cardholderName",
                    placeholder: "Nome dotitular do cartão",
                },
                cardholderEmail: {
                    id: "form-checkout__cardholderEmail",
                    placeholder: "E-mail do titular do cartão",
                },
                cardNumber: {
                    id: "form-checkout__cardNumber",
                    placeholder: "Número do cartão",
                },
                cardExpirationMonth: {
                    id: "form-checkout__cardExpirationMonth",
                    placeholder: "Mês",
                },
                cardExpirationYear: {
                    id: "form-checkout__cardExpirationYear",
                    placeholder: "Ano",
                },
                securityCode: {
                    id: "form-checkout__securityCode",
                    placeholder: "Código de segurança",
                },
                installments: {
                    id: "form-checkout__installments",
                    placeholder: "Parcelas",
                },
                identificationType: {
                    id: "form-checkout__identificationType",
                },
                identificationNumber: {
                    id: "form-checkout__identificationNumber",
                    placeholder: "Número de identificação",
                },
                issuer: {
                    id: "form-checkout__issuer",
                    placeholder: "Emissor",
                },
        },
  callbacks: {
    onFormMounted: error => {
        if (error)
            return console.warn("Form Mounted handling error: ", error);
        console.log("Montagem em formulário");
    },
    onSubmit: event => {
        event.preventDefault();
        document.getElementById("loading-message").style.display = "block";

        const {
            paymentMethodId,
            issuerId,
            cardholderEmail: email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
        } = cardForm.getCardFormData();

        console.log("Dados do formulário:", {
            paymentMethodId,
            issuerId,
            email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
        });

        fetch("/process_payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                issuerId,
                paymentMethodId,
                transactionAmount: Number(amount),
                installments: Number(installments),
                description: productDescription,
                payer: {
                    email,
                    identification: {
                        type: identificationType,
                        number: identificationNumber,
                    },
                },
            }),
        })
        .then(response => {
            console.log("Resposta da solicitação:", response);
            return response.json();
        })
        .then(result => {
            console.log("Resultado recebido:", result);
            document.getElementById("payment-id").innerText = result.id;
            document.getElementById("payment-status").innerText = result.status;
            document.getElementById("payment-detail").innerText = result.detail;
            $('.container__payment').fadeOut(500);
            setTimeout(() => { $('.container__result').show(500).fadeIn(); }, 500);
        })
        .catch(error => {
            console.error("Erro durante a solicitação:", error);
            alert("Unexpected error\n"+JSON.stringify(error));
        });
    },
    onFetching: (resource) => {
        console.log("Fetching resource: ", resource);
        const payButton = document.getElementById("form-checkout__submit");
        payButton.setAttribute('disabled', true);
        return () => {
            payButton.removeAttribute("disabled");
        };
    },
},
