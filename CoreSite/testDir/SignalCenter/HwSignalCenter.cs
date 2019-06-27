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
        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine(message);
            await Clients.Caller.SendAsync("ReceiveMessage", "server", $"Hello {user} WebSocket");
        }
    }
}