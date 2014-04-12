using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Web.Mvc;
using System.Web.Mvc;
using NuthinButNet.ViewModels;

namespace NuthinButNet.Controllers
{
    public class BlogController : SurfaceController
    {
        [HttpGet]
        [ChildActionOnly]
        public ActionResult Index(int? page)
        {
            int pageNumber = page ?? 0;
            var model = new BlogLandingViewModel();

            int blogsPerPage = int.Parse(CurrentPage.GetProperty("articlesPerPage").Value.ToString());
            int skipAmount = blogsPerPage * pageNumber;

            var blogPosts = CurrentPage.Children.OrderByDescending(x => DateTime.Parse(x.GetProperty("date").Value.ToString()));
            int totalBlogPosts = blogPosts.Count();

            model.BlogPosts = blogPosts.Skip(skipAmount).Take(blogsPerPage);

            if (pageNumber > 0 && totalBlogPosts > blogsPerPage)
            {
                model.PreviousButtonUrl = "?page=" + (pageNumber - 1);
            }
            if (totalBlogPosts > skipAmount + blogsPerPage)
            {
                model.NextButtonUrl = "?page=" + (pageNumber + 1);
            }

            return PartialView("BlogListings", model);

        }
    }
}