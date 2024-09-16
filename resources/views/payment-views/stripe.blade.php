@extends('payment-views.layouts.master')

@push('script')
    {{--stripe--}}
    <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
    <script src="https://js.stripe.com/v3/"></script>
@endpush

@section('content')
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
        }
        .full-screen-video {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    </style>

    <video class="full-screen-video" autoplay loop muted preload="auto">
        <source src="{{ asset('assets/CarregandoPagamento.mp4') }}" type="video/mp4">
        Your browser does not support the video tag.
    </video>

    {{-- @php($config = payment_config('stripe', 'payment_config')) --}}
    <script type="text/javascript">
        // Create an instance of the Stripe object with your publishable API key
        var stripe = Stripe('{{$config->published_key}}');
        document.addEventListener("DOMContentLoaded", function () {
            fetch("{{ url("payment/stripe/token/?payment_id={$data->id}") }}", {
                method: "GET",
            }).then(function (response) {
                console.log(response)
                return response.text();
            }).then(function (session) {
                console.log(session)
                return stripe.redirectToCheckout({sessionId: JSON.parse(session).id});
            }).then(function (result) {
                if (result.error) {
                    alert(result.error.message);
                }
            }).catch(function (error) {
                console.error("error:", error);
            });
        });
    </script>
@endsection
