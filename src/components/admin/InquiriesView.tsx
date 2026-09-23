// Admin inquiries: read-only list of enquiries from the website contact form.

import { useEffect, useState } from "react";
import {
  adminInquirySource,
  byNewest,
  formatInquiryDate,
  formatInquiryDateTime,
} from "../../lib/cms/inquiries";
import type { AdminInquiry } from "../../lib/cms/inquiries";
import { Skeleton } from "./fields";

export default function InquiriesView() {
  const [inquiries, setInquiries] = useState<AdminInquiry[] | null>(null);

  useEffect(() => {
    let live = true;
    adminInquirySource.list().then((value) => {
      if (live) setInquiries(value);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!inquiries) return <Skeleton />;

  const sorted = [...inquiries].sort(byNewest);

  return (
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
                <th scope="col">Email</th>
                <th scope="col">Event date</th>
                <th scope="col">Event type</th>
                <th scope="col">Guests</th>
                <th scope="col">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.name}</td>
                  <td>{inquiry.email}</td>
                  <td>{formatInquiryDate(inquiry.eventDate)}</td>
                  <td>{inquiry.eventType || "Not specified"}</td>
                  <td>{inquiry.guests || "-"}</td>
                  <td>{formatInquiryDateTime(inquiry.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
