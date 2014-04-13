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
    public static class SubProgramHelpers
    {
        private static readonly string NameField = "";

        public static MvcHtmlString GetName(this IPublishedContent subProgramNode)
        {
            // TODO: Get sub program name
            return MvcHtmlString.Create("Sub Program Name");
        }

        public static IEnumerable<IPublishedContent> GetAllSubPrograms(this IPublishedContent currentNode)
        {
            var root = currentNode.AncestorOrSelf(1);

            //return root.
            throw new NotImplementedException();
        }
    }
}