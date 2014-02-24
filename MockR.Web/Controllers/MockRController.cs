using Newtonsoft.Json;
using System;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace MockR.Web.Controllers
{
	public abstract class MockRController : Controller
	{
		public int DefaultPageSize { get; set; }

		public MockRController()
		{
			DefaultPageSize = 10;
		}

		// Done so that we can use Json.Net as our serializer which offers dates in the ISO 8601 standard
		// which is what is most widely supported in browsers.
		protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
		{
			return new JsonDotNetResult
			{
				Data = data,
				ContentType = contentType,
				ContentEncoding = contentEncoding,
				JsonRequestBehavior = behavior
			};
		}

		public class JsonDotNetResult : JsonResult
		{
			public JsonDotNetResult()
			{
				Settings = new JsonSerializerSettings
				{
					ReferenceLoopHandling = ReferenceLoopHandling.Error
				};
			}

			public JsonSerializerSettings Settings { get; private set; }

			public override void ExecuteResult(ControllerContext context)
			{
				if (context == null)
					throw new ArgumentNullException("context");
				if (this.JsonRequestBehavior == JsonRequestBehavior.DenyGet && string.Equals(context.HttpContext.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase))
					throw new InvalidOperationException("JSON GET is not allowed");

				HttpResponseBase response = context.HttpContext.Response;
				response.ContentType = string.IsNullOrEmpty(this.ContentType) ? "application/json" : this.ContentType;

				if (this.ContentEncoding != null)
					response.ContentEncoding = this.ContentEncoding;
				if (this.Data == null)
					return;

				var scriptSerializer = JsonSerializer.Create(this.Settings);

				using (var sw = new StringWriter())
				{
					scriptSerializer.Serialize(sw, this.Data);
					response.Write(sw.ToString());
				}
			}
		}
	}
}