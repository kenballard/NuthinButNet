using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Media;

namespace NuthinButNet.Helpers
{
    public static class ImageHelpers
    {
        public static string GetImageUrl(this UmbracoContext context, IPublishedContent node, string propertyName)
        {
            var helper = new UmbracoHelper(context);
            var imageId = node.GetPropertyValue<int>(propertyName);
            var typedMedia = helper.TypedMedia(imageId);
            return typedMedia != null ? typedMedia.Url : null;
        }
    }
}