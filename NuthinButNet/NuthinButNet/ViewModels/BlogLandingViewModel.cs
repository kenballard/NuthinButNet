using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;

namespace NuthinButNet.ViewModels
{
    public class BlogLandingViewModel
    {
        public string PreviousButtonUrl { get; set; }

        public string NextButtonUrl { get; set; }

        public IEnumerable<IPublishedContent> BlogPosts { get; set; }
    }
}