import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import api from "../src/services/api";

function EditTripPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    departure_city: "",
    destination_city: "",
    trip_date: "",
    description: "",
  });

  useEffect(() => {
    const savedTrip =
      localStorage.getItem(
        "editingTrip"
      );

    if (savedTrip) {
      setForm(JSON.parse(savedTrip));
    } else {
      api
        .get(`/trips/${id}/`)
        .then((response) => {
          setForm(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/trips/${id}/`,
        form
      );

      localStorage.removeItem(
        "editingTrip"
      );

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>
        Редактирование поездки
      </h2>

      <input
        type="text"
        value={form.departure_city}
        onChange={(e) =>
          setForm({
            ...form,
            departure_city:
              e.target.value,
          })
        }
      />

      <br />
      <br />

      <input
        type="text"
        value={form.destination_city}
        onChange={(e) =>
          setForm({
            ...form,
            destination_city:
              e.target.value,
          })
        }
      />

      <br />
      <br />

      <input
        type="date"
        value={form.trip_date}
        onChange={(e) =>
          setForm({
            ...form,
            trip_date:
              e.target.value,
          })
        }
      />

      <br />
      <br />

      <textarea
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description:
              e.target.value,
          })
        }
      />

      <br />
      <br />

      <button type="submit">
        Сохранить
      </button>
    </form>
  );
}

export default EditTripPage;