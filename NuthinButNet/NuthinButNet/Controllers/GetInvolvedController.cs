using Braintree;
using NuthinButNet.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using umbraco.cms.businesslogic.web;
using Umbraco.Web.Mvc;

namespace NuthinButNet.Controllers
{
    public class GetInvolvedController : SurfaceController
    {
        public void Submit(CheckoutViewModel checkout)
        {
            var success = Process(checkout);
            try
            {
                EmailConfirmations(checkout);
            } 
            catch
            {

            }
            
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

        private void EmailConfirmations(CheckoutViewModel checkout)
        {
            var fromBody = string.Format("from {0} {1} at {2}", checkout.FirstName, checkout.LastName, checkout.Email);
            var settings = GetEmailSettings();
            using (
                var client = new SmtpClient(settings.Server, settings.Port)
                {
                    Credentials = new NetworkCredential(settings.Username, settings.Password),
                    EnableSsl = settings.EnableSsl
                })
            {
                if (!string.IsNullOrEmpty(checkout.Money))
                {
                    client.Send(settings.From, settings.Money, "New Money Gift", string.Format("${0} {1}", checkout.Money, fromBody));
                }
                if (!string.IsNullOrEmpty(checkout.Time))
                {
                    client.Send(settings.From, settings.Time, "New Time Gift", string.Format("{0} hours {1}", checkout.Time, fromBody));
                }
                if (!string.IsNullOrEmpty(checkout.Talent))
                {
                    client.Send(settings.From, settings.Talent, "New Talent Gift", string.Format("{0} talent {1}", checkout.Talent, fromBody));
                }
                if (!string.IsNullOrEmpty(checkout.InKind))
                {
                    client.Send(settings.From, settings.Time, "New In Kind Gift", string.Format("{0} in kind {1}", checkout.InKind, fromBody));
                }
                client.Send(settings.From, checkout.Email, settings.Subject, settings.Body);
            }
        }

        private EmailSettings GetEmailSettings()
        {
            var document = Document.GetDocumentsOfDocumentType(1095).First();
            return new EmailSettings
            {
                Server = document.getProperty("server").Value.ToString(),
                Port = Convert.ToInt32(document.getProperty("port").Value),
                Username = document.getProperty("username").Value.ToString(),
                Password = document.getProperty("password").Value.ToString(),
                EnableSsl = document.getProperty("enableSSL").Value.ToString() == "1",
                From = document.getProperty("fromEmailAddress").Value.ToString(),
                Money = document.getProperty("moneyNotificationEmail").Value.ToString(),
                Time = document.getProperty("timeNotificationEmail").Value.ToString(),
                Talent = document.getProperty("talentNotificationEmail").Value.ToString(),
                InKind = document.getProperty("inKindNotificationEmail").Value.ToString(),
                Subject = document.getProperty("thankYouSubject").Value.ToString(),
                Body = document.getProperty("thankYouBody").Value.ToString()
            };
        }

        private class EmailSettings
        {
            public string Server { get; set; }
            public int Port { get; set; }
            public string Username { get; set; }
            public string Password { get; set; }
            public bool EnableSsl { get; set; }
            public string From { get; set; }
            public string Money { get; set; }
            public string Time { get; set; }
            public string Talent { get; set; }
            public string InKind { get; set; }
            public string Subject { get; set; }
            public string Body { get; set; }
        }
    }
}