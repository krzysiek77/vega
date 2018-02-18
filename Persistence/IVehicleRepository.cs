using System.Threading.Tasks;
using vega.Models;

namespace vega.Persistence
{
    // Repository is a collection of objects in memory!!!
    // So only methods that allows to manipulate the collection should be placed here. No SAVE, UPDATE method(s) allowed.
    public interface IVehicleRepository
    {
         Task<Vehicle> GetVehicle(int id, bool includeReleated = true);
         void Add(Vehicle vehicle);

         void Remove(Vehicle vehicle);
    }
}