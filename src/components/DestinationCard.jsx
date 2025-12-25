/**
 * Destination Card Component
 * Displays a summary of a destination including image, name, and description.
 * Used in lists of destinations.
 * 
 * @param {object} place - The destination object containing name, image, and description
 */
export default function DestinationCard({ place }) {
  return (
    <div className="bg-white shadow rounded-3 p-3 d-flex flex-column gap-2 transition-all hover-shadow">
      <img
        src={place.image}
        alt={place.name}
        className="w-100 object-fit-cover rounded-2"
        style={{ height: '160px' }}
      />
      <h2 className="h5 fw-semibold">{place.name}</h2>
      <p className="text-secondary">{place.description}</p>
    </div>
  );
}