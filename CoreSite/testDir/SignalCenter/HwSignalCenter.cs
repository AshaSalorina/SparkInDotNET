using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace CoreSite.testDir.SignalCenter
{
    public class HwSignalCenter : Hub
    {
        public async Task SMS(string user, string message)
        {
            Console.WriteLine(message);
            await Clients.Caller.SendAsync("RMS", "server", $"Hello {user} WebSocket");
        }
    }
}