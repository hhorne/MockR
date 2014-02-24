using System.Web.Mvc;
using Newtonsoft.Json;

namespace MockR.Web.Controllers
{
    public class HomeController : MockRController
    {
        public ActionResult Index()
        {
			//string prospectJson = System.IO.File.ReadAllText(Server.MapPath(Url.Content("~/App_Data/prospects.json")));
			//dynamic prospects = JsonConvert.DeserializeObject(prospectJson);

            return View();
        }
	}
}