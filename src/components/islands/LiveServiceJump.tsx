// Live services quick-jump nav (DEC-033).
// Mirrors the PageHeader slot list in services.astro: one anchor per
// service with its icon. New services add anchors without a refresh.
import type { ServiceItem } from "../../lib/cms/types";
import { fetchServices } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import { cardIconSvg } from "../live/icons";
import { useLiveRows } from "./useLiveSync";

export default function LiveServiceJump({ initial }: { initial: ServiceItem[] }) {
  const services = useLiveRows("services", initial, fetchServices);
  return (
    <ul className="service-jump">
      {services.map((service) => (
        <li key={service.id}>
          <a href={`#${service.id}`}>
            <span
              className="service-jump-icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: cardIconSvg(service.icon, 16) }}
            />
            {service.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
