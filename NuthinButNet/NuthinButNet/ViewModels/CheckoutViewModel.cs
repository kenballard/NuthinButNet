using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NuthinButNet.ViewModels
{
    public class CheckoutViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string CreditCard { get; set; }
        public string VerificationCode { get; set; }
        public string ExpyMonth { get; set; }
        public string ExpyYear { get; set; }
        public string Money { get; set; }
        public string Time { get; set; }
        public string Talent { get; set; }
        public string InKind { get; set; }
    }
}