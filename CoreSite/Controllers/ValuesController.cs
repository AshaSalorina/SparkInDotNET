using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Spark;
using Microsoft.Spark.Sql;

namespace CoreSite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        public class TtData
        {
            public string Ttuser { get; set; }
            public string Ttmsg { get; set; }

            public TtData(string a, string b)
            {
                Ttuser = a;
                Ttmsg = b;
            }
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<TtData>> Get()
        {
            if (testDir.testDataFrame.dataFrame == null)
            {
                return NotFound();
            }
            var rstr = new List<TtData>();

            var rstr2 = testDir.testDataFrame.dataFrame.Collect().ToList();

            foreach (var item in rstr2)
            {
                rstr.Add(new TtData(item.Get(0).ToString(), item.Get(1).ToString()));
            }
            return rstr;
            //return NotFound();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}