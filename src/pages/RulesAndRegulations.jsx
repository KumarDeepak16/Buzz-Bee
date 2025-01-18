import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShield,
  faCheck,
  faTimes,
  faExclamationTriangle,
  faHandshake,
  faUsers,
  faUserShield,
  faBalanceScale,
} from "@fortawesome/free-solid-svg-icons";

const RulesAndRegulations = () => {
  const sections = [
    {
      title: "Community Guidelines",
      icon: faUsers,
      content: [
        {
          subtitle: "Core Principles",
          points: [
            "Respect anonymity of all users",
            "Foster constructive discussions",
            "Maintain civil discourse",
            "Support diverse viewpoints",
            "Protect user privacy",
          ],
        },
      ],
    },
    {
      title: "Content Guidelines",
      icon: faBalanceScale,
      content: [
        {
          subtitle: "Acceptable Content",
          pros: [
            "Constructive feedback and opinions",
            "Relevant questions and discussions",
            "Educational content",
            "Creative expressions",
            "Professional critiques",
          ],
          cons: [
            "Hate speech or discrimination",
            "Personal attacks or harassment",
            "Explicit or inappropriate content",
            "Spam or promotional content",
            "Misleading information",
          ],
        },
      ],
    },
    {
      title: "Polling Ethics",
      icon: faHandshake,
      points: [
        "One vote per user/question",
        "Option to change votes",
        "Transparent vote counts",
        "No manipulation of results",
        "Respect for poll outcomes",
      ],
    },
    {
      title: "User Responsibility",
      icon: faUserShield,
      warnings: [
        "Don't share personal information",
        "Avoid inflammatory content",
        "Report violations promptly",
        "Maintain anonymity",
        "Use platform features responsibly",
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 mb-3 space-y-8 py-2 lg:py-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-yellow-400 heading tracking-widest mb-2">
          Platform Guidelines
        </h1>
        <p className="text-gray-400 text-lg">
          Fostering a safe and engaging community for anonymous interaction
        </p>
      </motion.div>

      <div className="grid gap-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/30 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-600 p-3 rounded-xl">
                <FontAwesomeIcon
                  icon={section.icon}
                  className="text-white text-xl"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            </div>

            {section.content?.map((contentSection, idx) => (
              <div key={idx} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-4">
                  {contentSection.subtitle}
                </h3>

                {contentSection.pros && contentSection.cons && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-green-400 font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheck} />
                        Encouraged
                      </h4>
                      <ul className="space-y-3">
                        {contentSection.pros.map((pro, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-gray-300"
                          >
                            <span className="text-green-400 text-sm">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-red-400 font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faTimes} />
                        Prohibited
                      </h4>
                      <ul className="space-y-3">
                        {contentSection.cons.map((con, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-gray-300"
                          >
                            <span className="text-red-400 text-sm">⨯</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {contentSection.points && (
                  <ul className="space-y-3">
                    {contentSection.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-300"
                      >
                        <span className="text-yellow-400 text-sm">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {section.points && (
              <ul className="space-y-3 mt-4">
                {section.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <span className="text-yellow-400 text-sm">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {section.warnings && (
              <div className="space-y-4 mt-4">
                <h4 className="text-yellow-400 font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  Important Warnings
                </h4>
                <ul className="space-y-3">
                  {section.warnings.map((warning, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <span className="text-yellow-400 text-sm">⚠</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/20 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-xl">
              <FontAwesomeIcon icon={faShield} className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Enforcement</h2>
          </div>

          <div className="space-y-4 text-gray-300">
            <p>
              Violation of these guidelines may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Content removal</li>
              <li>Temporary restriction of polling abilities</li>
              <li>Account suspension</li>
              <li>Permanent platform ban</li>
            </ul>
            <p className="mt-4 text-sm text-gray-400">
              We reserve the right to modify these guidelines at any time. Users will be notified of significant changes.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12 text-gray-400 text-sm"
      >
        <p>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>
    </div>
  );
};

export default RulesAndRegulations;