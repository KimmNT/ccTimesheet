import { useState, useMemo } from "react";
import style from "./Version.module.scss";

import versionData from "@/json/version.json";

interface VersionItem {
  version: string;
  date: string;
  changes: string;
  status: boolean;
}

export default function Version() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter versions by search term only
  const filteredVersions = useMemo(() => {
    return versionData.filter((item: VersionItem) =>
      item.version.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className={style.Container}>
      <div className={style.Content}>
        <h1 className={style.Title}>Version History</h1>

        <div className={style.SearchBox}>
          <input
            type="text"
            placeholder="Search by version..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.SearchInput}
          />
        </div>

        <div className={style.VersionList}>
          {filteredVersions.length > 0 ? (
            filteredVersions.map((item: VersionItem, index: number) => (
              <div
                key={index}
                className={`${style.VersionCard} ${
                  item.status ? style.ActiveVersion : ""
                }`}
              >
                <div className={style.VersionHeader}>
                  <h2 className={style.VersionNumber}>v{item.version}</h2>
                  <div className={style.VersionMeta}>
                    {item.status && (
                      <span className={style.ActiveBadge}>Active</span>
                    )}
                    <span className={style.VersionDate}>{item.date}</span>
                  </div>
                </div>
                <p className={style.VersionChanges}>{item.changes}</p>
              </div>
            ))
          ) : (
            <p className={style.NoResults}>No versions found</p>
          )}
        </div>
      </div>
    </div>
  );
}
