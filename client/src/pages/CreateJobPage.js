import { useState } from "react";
import { createJobMutation, jobByIdQuery } from "../lib/grapql/queries";
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";

function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [mutate, { loading }] = useMutation(createJobMutation);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      data: { job },
    } = await mutate({
      variables: { job: { title, desc: description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });

    navigate(`/jobs/${job.id}`);
  };

  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link"
                disabled={loading}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
