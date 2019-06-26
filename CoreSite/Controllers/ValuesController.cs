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
        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            if (Modles.testDir.testDataFrame.dataFrame == null)
            {
                return NotFound();
            }
            var rstr = new List<string>();

            var dFEnume = Modles.testDir.testDataFrame.dataFrame.Columns().GetEnumerator();

            while (dFEnume.MoveNext())
            {
                rstr.Add(dFEnume.Current);
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