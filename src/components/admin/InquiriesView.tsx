// Admin inquiries: clickable rows open a detail view with the full record, a
// Gmail response action and a guarded delete. The list updates in place.

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Mail, Trash2 } from "lucide-react";
import {
  byNewest,
  formatInquiryDate,
  formatInquiryDateTime,
  gmailComposeUrl,
} from "../../lib/cms/inquiries";
import { inquirySource } from "../../lib/supabase/inquiries";
import type { AdminInquiry } from "../../lib/cms/inquiries";
import { Notice, Skeleton } from "./fields";
import { confirmDelete, notifyError, notifySuccess } from "./alerts";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ad-detail-row">
      <dt>{label}</dt>
      <dd>{value || "-"}</dd>
    </div>
  );
}

export default function InquiriesView() {
  const [inquiries, setInquiries] = useState<AdminInquiry[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const source = inquirySource();

  useEffect(() => {
    let live = true;
    source
      .list()
      .then((value) => {
        if (live) setInquiries(value);
      })
      .catch(() => {
        if (live) {
          setInquiries([]);
          setLoadError(true);
        }
      });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = inquiries?.find((inquiry) => inquiry.id === selectedId) ?? null;

  const onDelete = useCallback(async () => {
    if (!selected) return;
    if (!(await confirmDelete(`enquiry from ${selected.name}`))) {
      return;
    }
    setDeleting(true);
    try {
      await source.remove(selected.id);
      const remaining = await source.list();
      setInquiries(remaining);
      setSelectedId(null);
      void notifySuccess("Inquiry deleted.");
    } catch {
      void notifyError("Could not delete this inquiry.", "Please try again.");
    } finally {
      setDeleting(false);
    }
  }, [selected, source]);

  if (!inquiries) return <Skeleton />;
  const sorted = [...inquiries].sort(byNewest);

  if (selected) {
    return (
      <div className="ad-stack">
        <p>
          <button
            type="button"
            className="ad-button ad-button--secondary"
            onClick={() => setSelectedId(null)}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to inquiries
          </button>
        </p>
        <section className="ad-panel" aria-label={`Inquiry from ${selected.name}`}>
          <div className="ad-panel-head">
            <div>
              <h2>{selected.name}</h2>
              <p className="ad-panel-lede">
                Submitted {formatInquiryDateTime(selected.submittedAt)}.
              </p>
            </div>
          </div>
          <dl className="ad-detail-list">
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.mobile ?? ""} />
            <DetailRow label="Event date" value={formatInquiryDate(selected.eventDate)} />
            <DetailRow label="Event type" value={selected.eventType ?? ""} />
            <DetailRow label="Venue" value={selected.venue ?? ""} />
            <DetailRow label="Guests" value={selected.guests ?? ""} />
            <DetailRow label="Photobooth" value={selected.photobooth ?? ""} />
            <DetailRow label="Message" value={selected.message ?? ""} />
          </dl>
          <p className="ad-inquiry-actions">
            <a
              className="ad-button ad-button--primary"
              href={gmailComposeUrl(
                selected.email,
                `Re: Your photobooth enquiry for ${formatInquiryDate(selected.eventDate)}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail size={16} aria-hidden="true" />
              Respond to Email
            </a>
            <button
              type="button"
              className="ad-button ad-button--secondary ad-button--danger"
              onClick={() => void onDelete()}
              disabled={deleting}
            >
              <Trash2 size={16} aria-hidden="true" />
              {deleting ? "Deleting..." : "Delete inquiry"}
            </button>
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="ad-stack">
      {loadError ? (
        <Notice tone="error" title="Could not load inquiries.">
          <p>Check your connection and refresh the page.</p>
        </Notice>
      ) : null}
      <section className="ad-panel" aria-label="All inquiries">
        <div className="ad-panel-head">
          <div>
            <h2>All inquiries</h2>
            <p className="ad-panel-lede">
              {inquiries.length} {inquiries.length === 1 ? "enquiry" : "enquiries"} from the website
              contact form, newest first.
            </p>
          </div>
        </div>
        {sorted.length === 0 ? (
          <div className="ad-empty">
            <h3>No inquiries yet</h3>
            <p>Enquiries from the website contact form will appear here.</p>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col" className="ad-hide-sm">
                    Email
                  </th>
                  <th scope="col">Event date</th>
                  <th scope="col">Event type</th>
                  <th scope="col" className="ad-hide-sm">
                    Guests
                  </th>
                  <th scope="col">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="ad-table-rowlink"
                    tabIndex={0}
                    onClick={() => setSelectedId(inquiry.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedId(inquiry.id);
                      }
                    }}
                    aria-label={`View inquiry from ${inquiry.name}`}
                  >
                    <td>{inquiry.name}</td>
                    <td className="ad-hide-sm">{inquiry.email}</td>
                    <td>{formatInquiryDate(inquiry.eventDate)}</td>
                    <td>{inquiry.eventType || "Not specified"}</td>
                    <td className="ad-hide-sm">{inquiry.guests || "-"}</td>
                    <td>{formatInquiryDateTime(inquiry.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
