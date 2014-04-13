using Braintree;
using NuthinButNet.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;

namespace NuthinButNet.Controllers
{
    public class GetInvolvedController : SurfaceController
    {
        public void Submit(CheckoutViewModel checkout)
        {
            var success = Process(checkout);
            if (!success)
            {
                throw new Exception("Processing failed.");
            }
        }

        private bool Process(CheckoutViewModel checkout)
        {
            var gateway = new BraintreeGateway
            {
                Environment = Braintree.Environment.SANDBOX,
                MerchantId = "h4gbd8c59p853zbh",
                PublicKey = "kwjdpvcx2hm45m87",
                PrivateKey = "682fb59e2a75daebdcf0326a57fc08d9"
            };

            if (string.IsNullOrEmpty(checkout.Money))
            {
                var request = GetCustomer(checkout);
                var result = gateway.Customer.Create(request);
                return result.IsSuccess();
            }
            else
            {
                // I don't know why, but custo fields in a customer in a transaction is throwing exceptions.  adding the customer separately for now
                var crequest = GetCustomer(checkout);
                var cresult = gateway.Customer.Create(crequest);

                if (cresult.IsSuccess())
                {
                    var request = GetTransaction(checkout);
                    request.Customer.CustomFields = null;
                    var result = gateway.Transaction.Sale(request);
                    return result.IsSuccess();

                }
                //if we made it here, the customer request failed...spit back fail...sorry for teh mess...we're running out of time.
                return false;
            }
        }

        private Braintree.TransactionRequest GetTransaction(CheckoutViewModel checkout)
        {
            return new Braintree.TransactionRequest
            {
                Amount = decimal.Parse(checkout.Money),
                CreditCard = new TransactionCreditCardRequest
                {
                    Number = checkout.CreditCard ?? "",
                    ExpirationMonth = checkout.ExpyMonth ?? "",
                    ExpirationYear = checkout.ExpyYear ?? "",
                    CVV = checkout.VerificationCode ?? "",
                    CardholderName = string.Format("{0} {1}", checkout.FirstName ?? "", checkout.LastName ?? ""),
                },
                Customer = GetCustomer(checkout),
                Options = new TransactionOptionsRequest
                {
                    StoreInVault = true
                }
            };
        }

        private Braintree.CustomerRequest GetCustomer(CheckoutViewModel checkout)
        {
            return new Braintree.CustomerRequest
            {
                FirstName = checkout.FirstName ?? "",
                LastName = checkout.LastName ?? "",
                Email = checkout.Email ?? "",
                Phone = checkout.Phone ?? "",
                CustomFields = new Dictionary<string, string>
                {
                    { "inkind", checkout.InKind ?? "none" } ,
                    { "talent", checkout.Talent ?? "none" },
                    { "hours", checkout.Time ?? "none" }
                }
            };
        }
    }
}